import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const DATA_FILE_PATH = path.join(__dirname, 'data', 'familyTree.json');

// Interface types
export interface FamilyMember {
  id: string;
  nameEn: string;
  nameBn: string;
  gender: 'male' | 'female';
  relation?: string;
  generation: number;
  avatar?: string;
  avatarImg?: string;
  phone?: string;
  occupation?: string;
  location?: string;
  bio?: string;
  isCurrentUser?: boolean;
}

export interface FamilyBranch {
  id: string;
  parentNameEn: string;
  parentNameBn: string;
  role: string;
  generation: number;
  gender: 'male' | 'female';
  avatar?: string;
  avatarImg?: string;
  color?: string;
  phone?: string;
  location?: string;
  occupation?: string;
  bio?: string;
  childrenCount: number;
  children: FamilyMember[];
}

export interface GrandParents {
  nana: FamilyMember;
  nanu: FamilyMember;
}

export interface FamilyTreeData {
  grandparents: GrandParents;
  branches: FamilyBranch[];
}

// Helper functions for file persistence
const getFamilyData = (): FamilyTreeData => {
  try {
    const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading familyTree.json:', error);
    throw new Error('Could not read family data');
  }
};

const saveFamilyData = (data: FamilyTreeData): void => {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving familyTree.json:', error);
    throw new Error('Could not save family data');
  }
};

// Calculate all flat members and analytics
const computeTreeDetails = (data: FamilyTreeData) => {
  const flatMembers: FamilyMember[] = [];

  // Add grandparents (Gen 1)
  flatMembers.push(data.grandparents.nana);
  flatMembers.push(data.grandparents.nanu);

  let gen2Count = 0;
  let gen3Count = 0;
  let males = 1; // Nana
  let females = 1; // Nanu

  // Add Generation 2 & 3
  data.branches.forEach((branch) => {
    gen2Count++;
    if (branch.gender === 'male') males++;
    else females++;

    flatMembers.push({
      id: branch.id,
      nameEn: branch.parentNameEn,
      nameBn: branch.parentNameBn,
      relation: branch.role,
      generation: branch.generation,
      gender: branch.gender,
      avatar: branch.avatar,
      avatarImg: branch.avatarImg,
      phone: branch.phone,
      location: branch.location,
      occupation: branch.occupation,
      bio: branch.bio
    });

    branch.children.forEach((child) => {
      gen3Count++;
      if (child.gender === 'male') males++;
      else females++;
      flatMembers.push(child);
    });
  });

  const stats = {
    totalMembers: flatMembers.length,
    generationsCount: 3,
    gen1Grandparents: 2,
    gen2Children: gen2Count,
    gen3Grandchildren: gen3Count,
    maleCount: males,
    femaleCount: females,
    branchesCount: data.branches.length,
    rootNana: data.grandparents.nana.nameBn,
    rootNanu: data.grandparents.nanu.nameBn
  };

  return { flatMembers, stats };
};

// ==================== REST API ROUTES ====================

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Bishaws Family Heritage API is active.' });
});

// 2. Get full family tree with branches & stats
app.get('/api/family', (_req: Request, res: Response) => {
  try {
    const data = getFamilyData();
    const { flatMembers, stats } = computeTreeDetails(data);
    res.json({
      success: true,
      tree: data,
      flatMembers,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve family tree' });
  }
});

// 3. Get all flat members with optional search and filter
app.get('/api/family/members', (req: Request, res: Response) => {
  try {
    const data = getFamilyData();
    const { flatMembers } = computeTreeDetails(data);
    const { search, generation, gender } = req.query;

    let filtered = [...flatMembers];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.nameEn.toLowerCase().includes(q) ||
          m.nameBn.includes(q) ||
          (m.relation && m.relation.toLowerCase().includes(q)) ||
          (m.occupation && m.occupation.toLowerCase().includes(q))
      );
    }

    if (generation && typeof generation === 'string') {
      const genNum = parseInt(generation, 10);
      if (!isNaN(genNum)) {
        filtered = filtered.filter((m) => m.generation === genNum);
      }
    }

    if (gender && typeof gender === 'string') {
      filtered = filtered.filter((m) => m.gender === gender);
    }

    res.json({ success: true, count: filtered.length, members: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to query members' });
  }
});

// 4. Get Statistics
app.get('/api/family/stats', (_req: Request, res: Response) => {
  try {
    const data = getFamilyData();
    const { stats } = computeTreeDetails(data);
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to compute stats' });
  }
});

// 5. Add a new member to a branch
app.post('/api/family/member', (req: Request, res: Response) => {
  try {
    const { branchId, nameEn, nameBn, gender, relation, phone, occupation } = req.body;

    if (!branchId || !nameEn || !nameBn) {
      return res.status(400).json({ success: false, message: 'branchId, nameEn and nameBn are required' });
    }

    const data = getFamilyData();
    const branch = data.branches.find((b) => b.id === branchId);

    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    const newMember: FamilyMember = {
      id: `b${branch.id.replace('branch-', '')}-c${Date.now()}`,
      nameEn,
      nameBn,
      gender: gender || 'male',
      relation: relation || 'নাতি / নাতনি',
      generation: 3,
      avatar: gender === 'female' ? '👩' : '👨',
      phone: phone || '',
      occupation: occupation || ''
    };

    branch.children.push(newMember);
    branch.childrenCount = branch.children.length;

    saveFamilyData(data);

    res.status(201).json({
      success: true,
      message: `${nameBn} (${nameEn}) সফলভাবে যুক্ত হয়েছেন!`,
      member: newMember
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add member' });
  }
});

// 6. Update an existing member
app.put('/api/family/member/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nameEn, nameBn, phone, occupation, location, bio } = req.body;

    const data = getFamilyData();
    let updated = false;

    // Check grandparents
    if (data.grandparents.nana.id === id) {
      if (nameEn !== undefined) data.grandparents.nana.nameEn = nameEn;
      if (nameBn !== undefined) data.grandparents.nana.nameBn = nameBn;
      if (phone !== undefined) data.grandparents.nana.phone = phone;
      if (occupation !== undefined) data.grandparents.nana.occupation = occupation;
      if (location !== undefined) data.grandparents.nana.location = location;
      if (bio !== undefined) data.grandparents.nana.bio = bio;
      updated = true;
    } else if (data.grandparents.nanu.id === id) {
      if (nameEn !== undefined) data.grandparents.nanu.nameEn = nameEn;
      if (nameBn !== undefined) data.grandparents.nanu.nameBn = nameBn;
      if (phone !== undefined) data.grandparents.nanu.phone = phone;
      if (occupation !== undefined) data.grandparents.nanu.occupation = occupation;
      if (location !== undefined) data.grandparents.nanu.location = location;
      if (bio !== undefined) data.grandparents.nanu.bio = bio;
      updated = true;
    } else {
      // Check branches and children
      for (const branch of data.branches) {
        if (branch.id === id) {
          if (nameEn !== undefined) branch.parentNameEn = nameEn;
          if (nameBn !== undefined) branch.parentNameBn = nameBn;
          if (phone !== undefined) branch.phone = phone;
          if (occupation !== undefined) branch.occupation = occupation;
          if (location !== undefined) branch.location = location;
          if (bio !== undefined) branch.bio = bio;
          updated = true;
          break;
        }

        const child = branch.children.find((c) => c.id === id);
        if (child) {
          if (nameEn !== undefined) child.nameEn = nameEn;
          if (nameBn !== undefined) child.nameBn = nameBn;
          if (phone !== undefined) child.phone = phone;
          if (occupation !== undefined) child.occupation = occupation;
          if (location !== undefined) child.location = location;
          if (bio !== undefined) child.bio = bio;
          updated = true;
          break;
        }
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    saveFamilyData(data);
    res.json({ success: true, message: 'সদস্যের তথ্য সফলভাবে আপডেট (SAVE) করা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update member' });
  }
});

// 7. Delete a member
app.delete('/api/family/member/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = getFamilyData();
    let deleted = false;

    for (const branch of data.branches) {
      const idx = branch.children.findIndex((c) => c.id === id);
      if (idx !== -1) {
        branch.children.splice(idx, 1);
        branch.childrenCount = branch.children.length;
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Child member not found to delete' });
    }

    saveFamilyData(data);
    res.json({ success: true, message: 'সদস্য মুছে ফেলা হয়েছে।' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete member' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🌿 Bishaws Family Heritage API running on http://localhost:${PORT}`);
});
